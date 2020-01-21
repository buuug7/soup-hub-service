import { ApiProperty } from '@nestjs/swagger';

export class CreateSoupDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  more?: object;
}
