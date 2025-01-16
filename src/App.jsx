import Chart from "./components/Chart"
import styled from "styled-components"

const Main = styled.main`
  max-width: 80%;
  margin: 0 auto;
`
const H1 = styled.h1`
  text-align: center;
`

function App() {

  return (
    <>
      <Main>

      <H1>Cotação de Moedas</H1>

      <Chart />
      </Main>
      
    </>
  )
}

export default App
