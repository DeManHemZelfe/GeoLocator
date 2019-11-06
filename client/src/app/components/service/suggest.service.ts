import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { fromLonLat } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestService {

  Default: '*:*';
  fl = ['id', 'weergavenaam', 'type', 'score'];



  constructor(private http: HttpClient) { }

  searchSuggest(input: string): Observable<HttpResponse<object>> {
    return this.http.get(`https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?q=${input}`, { observe: 'response' });
  }
  searchSpecific(id: string) {
    this.http.get(`https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?id=${id}`);
  }
  searchLocation(location: string) {
    this.http.get(`https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?q=${location}`);
  }

}
