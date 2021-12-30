import { get_remote_image } from "../../../resources/my-example-lambda/index";

test("get remote image", async () => {
  let image = await get_remote_image({
    bucket: "elocaters-photos-development",
    key: "2021_12_26__AtTheFarm__HomeForTheHolidays/2021_12_26_Farm_1967.JPG",
  });
  console.log(JSON.stringify(image));
});
