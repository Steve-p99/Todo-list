import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  constructor(private http:HttpClient) { }
  url="http://localhost/save.php"

  additem(aud:FormData)
{
  console.log("Sending");
  console.log(aud);
  //this.http.post("http://localhost/save.php",aud).subscribe(()=>console.log("posted to php page"));
  //this.http.post("http://localhost/save.php", aud //, {
    // transformRequest: angular.identity
    // headers: {'Content-Type' : undefined }}
  //).subscribe(()=>console.log("posted sound"));

// Helper function to send 
 xhr("http://localhost/save.php", aud, function (fileURL) {
          console.log('save.php');
          //window.open(fileURL);
      });
      function xhr(url, data, callback) {
          var request = new XMLHttpRequest();
          request.onreadystatechange = function () {
              if (request.readyState == 4 && request.status == 200) {
                  console.log(location.href + request.responseText)
                  callback(location.href + request.responseText);
              }
          };
         request.open('POST', url);
          request.send(data);
      }

}
}
