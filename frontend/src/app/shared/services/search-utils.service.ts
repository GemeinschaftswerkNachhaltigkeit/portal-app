import { Injectable } from '@angular/core';
import SearchResult, {
  SearchResultResponseContent
} from 'src/app/map/models/search-result';
import PagedResponse from '../models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class SearchUtilsService {
  mapSearchResults(results: PagedResponse<SearchResultResponseContent>) {
    const newResults: PagedResponse<SearchResult> = {
      number: results.number,
      size: results.size,
      totalElements: results.totalElements,
      totalPages: results.totalPages,
      content: []
    };
    newResults.content = results.content.map((r) => {
      const resType = r.resultType;
      if (resType === 'ORGANISATION') {
        return {
          ...r.organisation,
          resultType: resType
        } as SearchResult;
      } else if (resType === 'DAN') {
        return {
          ...r.activity,
          resultType: resType
        } as SearchResult;
      } else {
        return {
          ...r.activity,
          resultType: r.resultType
        } as SearchResult;
      }
    });
    return newResults;
  }
}
