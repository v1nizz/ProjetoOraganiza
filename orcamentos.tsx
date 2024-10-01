'use client';

import React, { useState, useEffect } from "react";

export interface CategoriaOrcamento {
  nome: string;
  meta: number;
  gastoAtual: number;
  alertaProximo: number;
  dataVencimento: string; 
}

const PaginaOrcamento = () => {
  const [categorias, setCategorias] = useState<CategoriaOrcamento[]>([]);
  const [novaCategoria, setNovaCategoria] = useState({
    nome: '',
    meta: 0,
    alertaProximo: 80,
    dataVencimento: '',
  });

  useEffect(() => {
    const categoriasSalvas = localStorage.getItem("categoriasOrcamento");
    console.log("Categorias salvas: ", categoriasSalvas); 
    if (categoriasSalvas) {
      setCategorias(JSON.parse(categoriasSalvas));
    }
  }, []);

  useEffect(() => {
    console.log("Salvando categorias no localStorage: ", categorias); 
    if (categorias.length > 0) {
      localStorage.setItem("categoriasOrcamento", JSON.stringify(categorias));
    }
  }, [categorias]);

  const adicionarCategoria = () => {
    const { nome, meta, alertaProximo, dataVencimento } = novaCategoria;

    if (nome && meta > 0 && dataVencimento) {
      const novaCategoriaObj: CategoriaOrcamento = {
        nome,
        meta,
        gastoAtual: 0,
        alertaProximo,
        dataVencimento,
      };
      setCategorias([...categorias, novaCategoriaObj]);
      setNovaCategoria({ nome: '', meta: 0, alertaProximo: 80, dataVencimento: '' });
    } else {
      alert('Preencha corretamente o nome, a meta e a data de vencimento!');
    }
  };

  const adicionarGasto = (nome: string, gasto: number) => {
    const categoriasAtualizadas = categorias.map((categoria: CategoriaOrcamento) => {
      if (categoria.nome === nome) {
        const novoGastoAtual = categoria.gastoAtual + gasto;

        if (novoGastoAtual >= categoria.meta * (categoria.alertaProximo / 100)) {
          alert(`Alerta: Gastos próximos do limite na categoria ${nome}`);
        }
        if (novoGastoAtual >= categoria.meta) {
          alert(`Alerta: Você excedeu o orçamento da categoria ${nome}`);
        }
        return { ...categoria, gastoAtual: novoGastoAtual };
      }
      return categoria;
    });

    setCategorias(categoriasAtualizadas);
  };

  const verificarVencimento = () => {
    const hoje = new Date();

    categorias.forEach((categoria) => {
      const dataVencimento = new Date(categoria.dataVencimento);
      const diferencaEmDias = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

      if (diferencaEmDias <= 2) {
        alert(`Alerta: O orçamento da categoria ${categoria.nome} vence em ${diferencaEmDias} dias!`);
      }
    });
  };

  useEffect(() => {
    verificarVencimento();
  }, [categorias]);

  return (
    <div>
      <h1>Gerenciador de Orçamento</h1>

      <h2>Adicionar Nova Categoria</h2>
      <input
        type="text"
        placeholder="Nome da Categoria"
        value={novaCategoria.nome}
        onChange={(e) =>
          setNovaCategoria({ ...novaCategoria, nome: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Meta de Orçamento"
        value={novaCategoria.meta}
        onChange={(e) =>
          setNovaCategoria({ ...novaCategoria, meta: parseFloat(e.target.value) })
        }
      />
      <input
        type="date"
        placeholder="Data de Vencimento"
        value={novaCategoria.dataVencimento}
        onChange={(e) =>
          setNovaCategoria({ ...novaCategoria, dataVencimento: e.target.value })
        }
      />
      <button onClick={adicionarCategoria}>Adicionar Categoria</button>

      <h2>Categorias de Orçamento</h2>
      <ul>
        {categorias.map((categoria: CategoriaOrcamento) => (
          <li key={categoria.nome}>
            <strong>{categoria.nome}</strong>: Meta: R${categoria.meta}, Gasto Atual: R${categoria.gastoAtual}, Data de Vencimento: {categoria.dataVencimento}
            <br />
            <input
              type="number"
              placeholder="Adicionar Gasto"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  adicionarGasto(categoria.nome, parseFloat(e.currentTarget.value));
                  e.currentTarget.value = ''; 
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginaOrcamento;
