import { ApiModelProperty } from '@nestjs/swagger';

export class LoginChallenge {
  @ApiModelProperty({})
  userName: string;

  @ApiModelProperty({})
  password: string;
}
