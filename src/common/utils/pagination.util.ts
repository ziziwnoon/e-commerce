import { PaginationDto } from "../dto/pagination.dto";

export function PaginationResolver(paginationDto: PaginationDto){
    let {page = 1 , limit = 10} = paginationDto

    if(!page || page<=0) page = 1;
    else page = page - 1

    if(!limit || limit<=0) limit = 10;

    let skip = limit * page

    return {
        page: page === 0 ? 1 : page ,
        limit ,
        skip
    }
}

export function PaginationGenerator(count: number , limit: number , page: number) {
    return {
        totlaCount: count ,
        limit: +limit,
        page: +page ,
        pageCount: Math.ceil(count / limit)
    }
}