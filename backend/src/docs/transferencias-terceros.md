# Documentación de Transferencias a Terceros

## Servicio externo

Actualmente: endpoint de prueba HTTPS (httpbin.org), en representación del futuro
servicio de mensajería (WhatsApp Business API) que notificará pedidos, según lo
contemplado en la arquitectura del sistema (bloque "Servicio Externo").

## Datos transferidos

- Teléfono de contacto del cliente (dato mínimo necesario para el envío)
- Detalle del pedido (productos, cantidad, total)
- Finalidad declarada del consentimiento

**No se transfieren:** nombre completo, ubicación exacta, ni ningún otro dato
personal fuera del mínimo necesario para notificar el pedido.

## Base legal

Consentimiento explícito y revocable del titular de los datos (cliente),
otorgado mediante `POST /api/consentimiento/otorgar` antes de cualquier
transferencia, conforme al principio de minimización de datos.

## Canal de transferencia

HTTPS/TLS (validación de certificado activa, sin excepciones), con
autenticación Bearer Token hacia el servicio externo.

## Control de acceso

La función `transferirDatosATercero` verifica el campo
`cliente.consentimientoTransferencia` antes de ejecutar cualquier envío.
Sin consentimiento registrado, la operación se rechaza con 403 y queda
registrada en la bitácora de auditoría.