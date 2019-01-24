import { ApiModelProperty } from '@nestjs/swagger';

export class ForgotPasswordChallenge {
  @ApiModelProperty({})
  email: string;
}
