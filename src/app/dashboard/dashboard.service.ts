import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, retryWhen } from 'rxjs';
import { throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private client: HttpClient) { }

  getEmailData(code: string, limit?: number, type = 'Google', nextPage?: string): Observable<string> {
    console.log('accessCode', code);
    return this.client.post(
      `https://gtvera4bp8.execute-api.us-east-1.amazonaws.com/dev/core/emails`,
      { code, limit, type, nextPage },
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<any>) => {
        if (response.body.success && response.body.data) {
          return response?.body?.data;
        } else {
          throw response?.body?.error?.message;
        }
      })
    );
  }

  getAnalyzedEmailData(email: any): Observable<any> {
    return this.client.post(
      `https://gtvera4bp8.execute-api.us-east-1.amazonaws.com/dev/core/completion`,
      { email },
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<any>) => {
        if (response.body.success && response.body.data) {
          return response?.body?.data;
        } else {
          throw new Error(response?.body?.error?.message);
        }
      })
    );
  }

  // getAnalyzedEmailDataWithRetries(email: any): Observable<any> {
  //   return this.client.post(
  //     `https://gtvera4bp8.execute-api.us-east-1.amazonaws.com/dev/core/completion`,
  //     { email },
  //     { observe: 'response' }
  //   ).pipe(
  //     map((response: HttpResponse<any>) => {
  //       if (response.body.success && response.body.data) {
  //         return response?.body?.data;
  //       } else {
  //         throw new Error(response?.body?.error?.message);
  //       }
  //     }),
  //   );
  // }


  retryRequest(request: any, retries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
      request()
        .then(resolve)
        .catch((error: any) => {
          if (retries === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          this.retryRequest(request, retries - 1, delay).then(resolve, reject);
        });
    });
  }
}
