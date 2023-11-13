use clap::Parser;
use regex::Regex;
use std::cmp::Ordering;
use std::collections::HashMap;
use std::path::Path;
use std::path::PathBuf;

use walkdir::WalkDir;

use anyhow::{Context, Result};

#[derive(Parser, Debug)]
#[command(author, version, about)]
struct Cli {
    /// Path to the folder containing images.
    #[arg(short, long)]
    input: PathBuf,

    /// Output path where the generated pages should be emitted.
    #[arg(short, long, default_value_t = String::from("dist"))]
    output: String,
}

#[derive(Debug, Clone)]
pub struct OriginalImage {
    pub path: PathBuf,
    pub relative: PathBuf,
}

impl OriginalImage {
    pub fn new<S, T>(path: S, relative: T) -> Self
    where
        S: AsRef<Path>,
        T: AsRef<Path>,
    {
        Self {
            path: path.as_ref().to_path_buf(),
            relative: relative.as_ref().to_path_buf(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Album {
    pub name: String,
    pub originals: Vec<OriginalImage>,
}

impl Album {
    pub fn compute_album_name<P>(relative_path: &P) -> Result<String>
    where
        P: AsRef<Path>,
    {
        let full_name: String = relative_path
            .as_ref()
            .parent()
            .and_then(|p| p.to_str())
            .map(|s| String::from(s))
            .context("Unable to get the album name!")?;

        let re = Regex::new("(\\d\\d\\d\\d)_(\\d\\d)_(\\d\\d)__(.*)").unwrap();
        let (_, [year_s, month_s, day_s, album_name]) = re
            .captures(&full_name)
            .context("couldn't match album name!")?
            .extract();



        Ok(album_name.to_string())
    }

    pub fn new<S>(name: S, image: OriginalImage) -> Self
    where
        S: Into<String>,
    {
        Self {
            name: name.into().to_owned(),
            originals: vec![image],
        }
    }
}

pub fn process_images<P>(path: &P) -> Result<Vec<Album>>
where
    P: AsRef<Path>,
{
    let mut albums: HashMap<String, Album> = HashMap::new();
    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if entry.file_name().to_str().unwrap().ends_with(".JPG") {
            let relative_path = entry.path().strip_prefix(path)?;
            let album_name = Album::compute_album_name(&relative_path)?;

            let image = OriginalImage::new(entry.path(), relative_path);
            albums
                .entry(album_name.clone())
                .and_modify(|album| album.originals.push(image.clone()))
                .or_insert(Album::new(&album_name, image.clone()));
        }
    }

    let mut albums: Vec<Album> = albums.values().cloned().collect();
    albums.sort_by(|a, b| {
        if a.name < b.name {
            return Ordering::Greater;
        } else {
            return Ordering::Less;
        }
    });
    Ok(albums)
}

pub fn main() -> Result<()> {
    let args = Cli::parse();

    let path = PathBuf::from(args.input);
    let albums = process_images(&path)?;

    for album in albums {
        println!("Album: {} {{", album.name);
        println!("  - {} images", album.originals.len());
        println!("}}");
    }

    Ok(())
}
