use clap::Parser;
use std::path::Path;
use std::path::PathBuf;

use walkdir::WalkDir;

#[derive(Parser, Debug)]
#[command(author, version, about)]
struct Cli {
    /// Path to the folder containing images.
    #[arg(short, long)]
    input: PathBuf,

    /// Output path where resized and compressed images will be
    /// output.
    #[arg(short, long)]
    output: PathBuf,

    #[arg(short, long)]
    format: String,

    #[arg(short, long)]
    size: String,
}

pub fn process_images<P>(path: &P)
where
    P: AsRef<Path>,
{
    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if entry.file_name().to_str().unwrap().ends_with(".JPG") {
            println!("JPEG {:?}", entry.file_name());
        }
    }
}

pub fn main() {
    let args = Cli::parse();

    println!("{:?}", args);

    let path = "assets/original";
    process_images(&path);
}
