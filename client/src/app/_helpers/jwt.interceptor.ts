// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';


// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor() { }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let currentUser = null;
//     if (currentUser && currentUser.token) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: currentUser.token
//         }
//       });
//     }

//     return next.handle(request);
//   }
// }
