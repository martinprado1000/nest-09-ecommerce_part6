import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(()=> Number)
    limit?:number
    
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    @Type(()=> Number)  
    offset?:number

}   