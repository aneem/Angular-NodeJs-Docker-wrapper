import { ApiModelProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiModelProperty({})
  token: string;
}
