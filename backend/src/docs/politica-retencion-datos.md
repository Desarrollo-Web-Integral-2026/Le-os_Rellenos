# Política de Minimización y Retención de Datos - Leños Rellenos.

## Datos personales recabados.

|
 Campo 
|
 Finalidad 
|
 Tiempo de retención 
|
 Acción al vencer 
|
|
-------
|
-----------
|
----------------------
|
-------------------
|
|
 nombre 
|
 Identificar al cliente en su pedido y entrega 
|
 365 días desde el registro 
|
 Anonimización 
|
|
 telefono 
|
 Coordinar entrega y contacto vía WhatsApp 
|
 365 días desde el registro 
|
 Anonimización 
|
|
 ubicacion 
|
 Realizar la entrega física del pedido 
|
 365 días desde el registro 
|
 Anonimización 
|

## Proceso de anonimización
- Un job automático (`node-cron`) revisa diariamente (3:00 AM) a los clientes con estado `activo`.
- Si la fecha actual supera `fechaRegistro + diasRetencion`, el cliente se marca como `anonimizado`:
  reemplazando nombre, telefono y ubicación por valores no identificables.
- Los pedidos historicos (`Pedido`, `DetallePedido`) del cliente **no se eliminan**, para preservar
  la integridad de los registros de ventas del nogocio.

## Justificación de los 365 días
Se eligió un año como período de retención estándar por ser un negocio familiar de recompra
frecuente (clientes que vuelven a pedir en fechas similares, ej. temporada) ajustable según
política real del nogocio.