const API_BASE = process.env.REACT_APP_API_URL || '';
const API_TOKEN = process.env.REACT_APP_API_TOKEN || '';

function authHeaders() {
  return {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export async function buscarPedidoPorChave(chave) {
  const response = await fetch(`${API_BASE}/api/v1/wms_ecommerce/${chave}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }

  const json = await response.json();

  if (!json.data || json.data.length === 0 || json.status_code === 404) {
    throw new Error('Nenhum pedido encontrado para esta chave');
  }

  const itens = json.data;
  const primeiro = itens[0];

  return {
    cabecalho: {
      idclifor: primeiro.IDCLIFOR,
      nomeCliente: primeiro.NOME,
      numnota: primeiro.NUMNOTA,
      idorcamento: primeiro.IDORCAMENTO,
    },
    itens: itens.map((item) => ({
      sku: item.IDPRODUTO,
      descricao: item.DESCRCOMPRODUTO,
      codigoBarras: String(item.IDCODBARPROD || ''),
      quantidade: item.QTDPRODUTO || 1,
      sequencia: item.NUMSEQUENCIAVENDA,
    })),
  };
}

export async function buscarEmbalagensConferidas(numnota) {
  const response = await fetch(
    `${API_BASE}/api/v1/wms_ecommerce_embalagens/?numnota=${encodeURIComponent(numnota)}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar embalagens: ${response.status}`);
  }

  return await response.json();
}

export async function registrarEmbalagem({ idproduto, method, numnota, user }) {
  const response = await fetch(`${API_BASE}/api/v1/wms_ecommerce_embalagens/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ idproduto, method, numnota, user }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao registrar embalagem: ${response.status}`);
  }

  return await response.json();
}
