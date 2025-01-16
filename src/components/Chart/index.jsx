import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ListaMoedas from '../ListaMoedas'; // Importando o componente ListaMoedas

const apiHistorical = import.meta.env.VITE_API_HISTORICAL_URL
const apiMoedas = import.meta.env.VITE_API_MOEDAS_URL


const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moedaSelecionada, setMoedaSelecionada] = useState('USD-BRL'); // Moeda padrão
  const [moedasList, setMoedasList] = useState([]);  // Inicializando como uma lista vazia

  /* Buscar dados do backend */
  const fetchHistoricalData = async (moeda) => {
    try {
      const response = await axios.get(`${apiHistorical}${moeda}`);
      console.log("Dados de historical", response.data);

      /* Processar dados */
      const labels = response.data.map(item => {
        const date = new Date(item.timestamp * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }).reverse();

      const prices = response.data.map(item => parseFloat(item.bid)).reverse();

      setChartData({
        labels: labels,
        datasets: [
          {
            label: `Preço de fechamento de ${moeda}`,
            data: prices,
            borderColor: "#006A4A",
            backgroundColor: "#006A4A",
            borderWidth: 3,
            tension: 0.5
          }
        ]
      });

      setLoading(false);
    } catch (error) {
      console.log("Erro ao buscar dados do backend", error);
    }
  };

  const fetchMoedas = async () => {
    try {
      const response = await axios.get(`${apiMoedas}`);
      console.log("Dados de Moedas", response.data);

      // Processar dados de moedas para preenchimento da lista de opções
      const moedas = Object.keys(response.data.xml).map(key => ({
        value: key,
        label: response.data.xml[key][0]
      }));
      setMoedasList(moedas);
    } catch (error) {
      console.log("Erro ao buscar dados do backend", error);
    }
  };

  const handleCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    setMoedaSelecionada(selectedCurrency);
    setLoading(true);  // Exibe o carregamento enquanto os dados são recuperados
  };

  const handleSearchClick = () => {
    setLoading(true);  // Exibe o carregamento enquanto os dados são recuperados
    fetchHistoricalData(moedaSelecionada);  // Atualiza os dados do gráfico com a moeda selecionada
  };

  useEffect(() => {
    fetchHistoricalData(moedaSelecionada);
    fetchMoedas();
  }, [moedaSelecionada]);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>

      {/* Componente ListaMoedas para selecionar a moeda */}
      <ListaMoedas
        moedasList={moedasList}
        selectedCurrency={moedaSelecionada}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Botão de pesquisa */}
      <Button onClick={handleSearchClick}>Pesquisar</Button>

      {/* Componente Line do gráfico */}
      {chartData && (
        <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'white'  // Cor da legenda
              },
            },
            title: {
              display: true,
              text: `Histórico do Preço da ${moedaSelecionada}`,
              color: 'white'  // Cor do título
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Datas',
                color: 'white',  // Cor do título do eixo X
              },
              ticks: {
                color: 'white'  // Cor dos ticks (labels) do eixo X
              },
              grid: {
                color: 'rgba(255,255,255, 0.3)' // Cor da grade no eixo X
              }
            },
            y: {
              title: {
                display: true,
                text: 'Valor em R$',
                color: 'white',  // Cor do título do eixo Y
              },
              ticks: {
                color: 'white'  // Cor dos ticks (labels) do eixo Y
              },
              grid: {
                color: 'rgba(255,255,255, 0.3)'  // Cor da grade no eixo Y
              }
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            },
            point: {
              radius: 3,  // Tamanho do ponto no gráfico (definido como 0 para esconder os pontos)
            }
          },
        }}
        />
      )}
    </div>
  );
}
