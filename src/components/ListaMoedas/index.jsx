/* eslint-disable react/prop-types */
import styled from 'styled-components';

/* Estilização */
const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 200px;
  background-color: #fff;
`;

const Label = styled.label`
  font-size: 18px;
  margin-right: 10px;
`;

export default function ListaMoedas({ moedasList = [], selectedCurrency, onCurrencyChange }) {

  return (
    <div>
      <Label htmlFor="currency">Selecione a Moeda: </Label>
      <Select
        id="currency"
        value={selectedCurrency}
        onChange={onCurrencyChange}
      >
        {moedasList.map((moeda) => (
          <option key={moeda.value} value={moeda.value}>
            {moeda.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
