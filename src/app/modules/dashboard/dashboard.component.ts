import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../services/auth.service';

import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  veiculosGeral: any[] = [];
  veiculosTabela: any[] = [];
  veiculoDestaque: any = null;
  imagemVeiculo: string = 'img/ford.png';

  metricaVendas: number = 0;
  metricaConectados: number = 0;
  metricaSoftware: number = 0;

  buscaTabelaCtrl = new FormControl('');
  selecaoVeiculoCtrl = new FormControl('');

  // VARIÁVEIS NOVAS PARA ARMAZENAR OS DADOS DO VIN DA API
  telemetriaVin: any = null;
  erroPesquisa: string | null = null;
// VARIÁVEIS DO MENU
  menuAberto: boolean = false;

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }
  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarDadosIniciais();
    this.configurarFiltroTabelaRxJS();
    this.configurarCardsMetricasRxJS();
  }

  carregarDadosIniciais(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (dados) => {
        this.veiculosGeral = dados;
        this.veiculosTabela = dados;
        if (dados && dados.length > 0) {
          this.selecaoVeiculoCtrl.setValue(dados[0].vehicle);
        }
      }
    });
  }

  // ATUALIZADO: Lógica de pesquisa inteligente
  configurarFiltroTabelaRxJS(): void {
    this.buscaTabelaCtrl.valueChanges.pipe(
      filter(valor => valor !== null),
      debounceTime(500), // Aguarda meio segundo
      distinctUntilChanged()
    ).subscribe(termo => {
      const termoBusca = termo!.trim().toUpperCase(); // VINs são maiúsculos
      
      // Reseta os resultados anteriores
      this.telemetriaVin = null;
      this.erroPesquisa = null;

      if (!termoBusca) {
        this.veiculosTabela = this.veiculosGeral;
        return;
      }

      // Se o termo digitado for muito grande (Ex: "2FRHDUYS2Y63NHD22454") faz o POST na API
      if (termoBusca.length > 10) {
        this.vehicleService.getVehicleDataByVin(termoBusca).subscribe({
          next: (dadosDaApi) => {
            // Guarda a telemetria recebida da API
            this.telemetriaVin = { vin: termoBusca, ...dadosDaApi };
            this.veiculosTabela = []; // Esconde a tabela normal
          },
          error: (err) => {
            this.erroPesquisa = 'Código VIN utilizado não foi encontrado na base de dados!';
            this.veiculosTabela = [];
          }
        });
      } else {
        // Se for uma palavra pequena, filtra os modelos normais da tabela
        this.veiculosTabela = this.veiculosGeral.filter(v => 
          v.vehicle.toLowerCase().includes(termoBusca.toLowerCase())
        );
      }
    });
  }

  configurarCardsMetricasRxJS(): void {
    this.selecaoVeiculoCtrl.valueChanges.subscribe(nomeCarro => {
      if (!nomeCarro) return;
      const carroEncontrado = this.veiculosGeral.find(v => v.vehicle === nomeCarro);
      if (carroEncontrado) {
        this.veiculoDestaque = carroEncontrado;
        this.atualizarImagemCentro(carroEncontrado.vehicle);

        const fluxoCarro$ = of(carroEncontrado);
        fluxoCarro$.pipe(map(c => c.volumetotal)).subscribe(val => this.metricaVendas = val);
        fluxoCarro$.pipe(map(c => c.connected)).subscribe(val => this.metricaConectados = val);
        fluxoCarro$.pipe(map(c => c.softwareUpdates)).subscribe(val => this.metricaSoftware = val);
      }
    });
  }

  atualizarImagemCentro(nomeVeiculo: string): void {
    const nomeLimpo = nomeVeiculo.toLowerCase();
    if (nomeLimpo.includes('mustang')) this.imagemVeiculo = 'img/mustang.png';
    else if (nomeLimpo.includes('ranger')) this.imagemVeiculo = 'img/ranger.png';
    else if (nomeLimpo.includes('territory')) this.imagemVeiculo = 'img/territory.png';
    else if (nomeLimpo.includes('bronco')) this.imagemVeiculo = 'img/broncoSport.png';
    else this.imagemVeiculo = 'img/ford.png';
  }

  executarLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}