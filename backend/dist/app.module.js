"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const movies_module_1 = require("./modules/movies/movies.module");
const locations_module_1 = require("./modules/locations/locations.module");
const photos_module_1 = require("./modules/photos/photos.module");
const comments_module_1 = require("./modules/comments/comments.module");
const checklist_module_1 = require("./modules/checklist/checklist.module");
const recommendations_module_1 = require("./modules/recommendations/recommendations.module");
const feed_module_1 = require("./modules/feed/feed.module");
const gallery_module_1 = require("./modules/gallery/gallery.module");
const search_module_1 = require("./modules/search/search.module");
const upload_module_1 = require("./modules/upload/upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, movies_module_1.MoviesModule, locations_module_1.LocationsModule, photos_module_1.PhotosModule, comments_module_1.CommentsModule, checklist_module_1.ChecklistModule, recommendations_module_1.RecommendationsModule, feed_module_1.FeedModule, gallery_module_1.GalleryModule, search_module_1.SearchModule, upload_module_1.UploadModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map