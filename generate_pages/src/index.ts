import {list_all_folders} from './s3_utility.js';

function split_on_doubles(name: string): string {
  return name.replace(/__/g, " ");
}

function split_camel_case(name: string): string {
  return name
    .split(/([A-Z][a-z]+)/)
    .filter(e => e)
    .map(e => e.trim())
    .join(" ");
}

async function pretty_folder_listing(bucket: string): Promise<string[]> {
  let pretty_folders: string[] = [];
  let all_folders = await list_all_folders(bucket);
  for (let folder of all_folders) {
    pretty_folders.push(split_camel_case(split_on_doubles(folder)));
  }
  return pretty_folders;
}

//list_all_objects("elocaters-photos").then(console.log, console.error);
pretty_folder_listing("elocaters-photos").then(console.log, console.error);

