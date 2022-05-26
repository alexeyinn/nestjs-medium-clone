import { User } from "@app/user/decorators/user.decorator";
import { Controller, Get, Param } from "@nestjs/common";
import { ProfileService } from "@app/profile/profile.service";
import { ProfileResponseInterface } from "@app/profile/types/profileResponse.interface";

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
}
