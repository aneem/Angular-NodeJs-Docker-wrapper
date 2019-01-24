import { ApiModelProperty } from '@nestjs/swagger';

export class ChangePasswordChallenge {
  @ApiModelProperty()
  userId: number;

  @ApiModelProperty()
  userName: string;

  @ApiModelProperty()
  currentPassword: string;

  @ApiModelProperty()
  newPassword: string;
}
