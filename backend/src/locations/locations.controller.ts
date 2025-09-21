import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('locations/:locationId/movies')
  async getMoviesByLocation(@Param('locationId') locationId: string) {
    return this.locationsService.getMoviesByLocation(parseInt(locationId));
  }

  @Get('movies/:movieId/locations/:locationId')
  async getLocationByMovie(@Param('movieId') movieId: string, @Param('locationId') locationId: string) {
    return this.locationsService.getLocationByMovie(parseInt(movieId), parseInt(locationId));
  }
}
