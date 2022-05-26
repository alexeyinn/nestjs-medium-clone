import { User } from "@app/user/decorators/user.decorator";
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ProfileService } from "@app/profile/profile.service";
import { ProfileResponseInterface } from "@app/profile/types/profileResponse.interface";
import { AuthGuard } from "@app/user/guards/auth.guard";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(":userName")
  async getProfile(
    @User("id") currentUserId: number,
    @Param("userName") profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      profileUsername
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(":userName/follow")
  @UseGuards(AuthGuard)
  async followProfile(
    @User("id") currentUserId: number,
    @Param("userName") profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      profileUsername
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(":userName/follow")
  @UseGuards(AuthGuard)
  async unFollowProfile(
    @User("id") currentUserId: number,
    @Param("userName") profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unFollowProfile(
      currentUserId,
      profileUsername
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
