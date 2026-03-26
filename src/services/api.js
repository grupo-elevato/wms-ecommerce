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
  // Tentar com numnota no path
  const url = `${API_BASE}/api/v1/wms_ecommerce_embalagens/${encodeURIComponent(numnota)}`;
  console.log('[WMS] Buscando embalagens em:', url);

  const response = await fetch(url, { headers: authHeaders() });

  // 404 = nenhum item conferido ainda, retornar vazio
  if (response.status === 404) {
    console.log('[WMS] Nenhuma embalagem encontrada (404)');
    return { data: [] };
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error('[WMS] Erro na API embalagens:', response.status, text);
    throw new Error(`Erro ao buscar embalagens: ${response.status}`);
  }

  const json = await response.json();
  console.log('[WMS] Resposta embalagens raw:', json);
  return json;
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
