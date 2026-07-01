import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3001'; 

  
  getVehicles(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/vehicles`).pipe(
      map(response => response.vehicles)
    );
  }


  getVehicleDataByVin(vin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vehicleData`, { vin });
  }
}