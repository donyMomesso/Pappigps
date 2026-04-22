#!/bin/bash

# Test route creation via API
echo "🧪 Testing route creation via API..."

# First get the orders
echo "Getting orders..."
ORDERS=$(curl -s http://localhost:3000/api/pedidos 2>/dev/null | jq -r '.pedidos[0:3] | map(.id)' 2>/dev/null)
echo "Orders: $ORDERS"

# Get deliverers
echo "Getting deliverers..."
DELIVERERS=$(curl -s http://localhost:3000/api/entregadores 2>/dev/null)
echo "Deliverers response length: $(echo $DELIVERERS | wc -c)"

# Get first deliverer ID
ENTREGADOR_ID=$(echo $DELIVERERS | jq -r '.[0].id' 2>/dev/null)
echo "First deliverer ID: $ENTREGADOR_ID"

# Create route
if [ ! -z "$ENTREGADOR_ID" ] && [ "$ENTREGADOR_ID" != "null" ]; then
  echo "Creating route..."
  PEDIDO_IDS=$(curl -s http://localhost:3000/api/pedidos 2>/dev/null | jq -r '.pedidos[0:5] | map(.id) | @json' 2>/dev/null)
  
  echo "Request data:"
  echo "{\"pedidoIds\": $PEDIDO_IDS, \"entregadorId\": \"$ENTREGADOR_ID\", \"nome\": \"Rota Teste\"}"
  
  curl -X POST http://localhost:3000/api/rotas \
    -H "Content-Type: application/json" \
    -d "{\"pedidoIds\": $PEDIDO_IDS, \"entregadorId\": \"$ENTREGADOR_ID\", \"nome\": \"Rota Teste\"}" \
    -v 2>&1 | head -50
else
  echo "❌ No deliverer ID found"
fi
