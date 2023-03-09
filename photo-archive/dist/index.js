"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAlbumMetadata = void 0;
const metadata_1 = require("./metadata");
Object.defineProperty(exports, "listAlbumMetadata", { enumerable: true, get: function () { return metadata_1.listAlbumMetadata; } });
(0, metadata_1.listAlbumMetadata)().then((albums) => {
    console.log(JSON.stringify(albums, null, 2));
});
