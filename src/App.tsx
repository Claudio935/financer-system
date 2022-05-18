import React from 'react';
import {AreaTotal, Header, Body} from './Areas'
import { TabelaFinanceira } from './Tabela';
function App() {
  return (
    <AreaTotal >
      <Header>
        Sistema Financeiro
      </Header>
      <Body>
        <TabelaFinanceira />
      </Body>
    </AreaTotal>
  );
}

export default App;
