Nipponia
Sistema web local de inventario, catálogo, pedidos y punto de venta para stands de mangas, cómics y productos coleccionables.

Versión: v1.0.0-mvp

Repositorio:
https://github.com/CharlyDuque/nipponia-inventario-pos

Descripción
Nipponia permite administrar productos y ventas dentro de una red local, sin depender de una conexión externa a Internet.

El sistema divide la experiencia en dos perfiles:

Cliente: consulta el catálogo, busca productos, administra un carrito y genera un pedido QR.
Operador: administra inventario, recibe pedidos, cobra ventas, genera tickets, cancela ventas y consulta el corte de caja.
La computadora principal ejecuta el frontend, la API y MongoDB. Los teléfonos o tabletas conectados a la misma red pueden acceder al catálogo mediante la dirección IP local o un código QR de acceso.

Objetivo
Reducir el tiempo de atención y los errores de inventario durante la operación de un stand.

Nipponia busca resolver situaciones como:

Consultar precios y existencias manualmente.
Atender catálogo, cobro e inventario desde una sola lista.
Registrar ventas sin actualizar correctamente el stock.
Perder trazabilidad al cancelar una venta.
Depender de Internet durante un evento.
Permitir cobros duplicados sobre el mismo pedido.
Funcionalidades principales
Cliente
Consultar catálogo desde teléfono, tableta o computadora.
Buscar por nombre, código o categoría.
Consultar precio y stock disponible.
Agregar productos al carrito.
Modificar cantidades mediante botones − y +.
Escribir cantidades manualmente.
Quitar productos.
Consultar unidades y subtotal estimado.
Generar un pedido persistente.
Mostrar un QR versión 2 con el identificador del pedido.
Consultar automáticamente el estado del pedido.
Vaciar el carrito después de confirmarse la compra.
Conservar el carrito si el pedido expira o es cancelado.
Operador
Acceder mediante PIN.
Crear productos.
Editar productos.
Aplicar baja lógica.
Consultar productos inactivos.
Reactivar productos.
Cargar un pedido desde su contenido QR.
Verificar productos, cantidades, precios y stock actuales.
Cobrar mediante efectivo.
Calcular cambio.
Registrar pagos mediante transferencia.
Generar un ticket con folio.
Consultar historial de ventas.
Buscar por folio, producto o código.
Cancelar ventas con motivo.
Restaurar automáticamente el stock al cancelar.
Consultar corte de caja por fecha.
Separar ingresos en efectivo y transferencia.
Cerrar la sesión administrativa.
Flujo principal
Cliente abre el catálogo
        ↓
Agrega productos al carrito
        ↓
Genera un pedido persistente
        ↓
El sistema genera un QR con pedidoId
        ↓
El Operador carga el contenido en Caja
        ↓
El servidor verifica precios y stock
        ↓
El Operador selecciona el método de pago
        ↓
Se registra la venta y se descuenta el stock
        ↓
El Pedido cambia a Completado
        ↓
Se genera el ticket
        ↓
El carrito del Cliente se vacía automáticamente

Códigos QR

Nipponia utiliza dos tipos diferentes de QR.

QR de acceso al catálogo

Contiene una URL local como:

Plain Text
http://192.168.100.19:5173/cliente/catalogo

Permite que un Cliente conectado a la misma red abra directamente el catálogo.

La URL se configura en:

Plain Text
frontend/.env

Ejemplo:

Plain Text
env isn’t fully supported. Syntax highlighting is based on Plain Text.
VITE_PUBLIC_APP_URL=http://192.168.100.19:5173

No se debe usar localhost en un QR destinado a otro dispositivo. En un teléfono, localhost apunta al propio teléfono.

QR del pedido

Contiene únicamente información mínima:

JSON
{
"tipo": "nipponia-pedido",
"version": 2,
"pedidoId": "ObjectId del pedido"
}

El QR no contiene precios, totales ni stock. La Caja obtiene esa información nuevamente desde MongoDB.

Tecnologías
Frontend
React 19
Vite 8
React Router 7
CSS Modules
Lucide React
qrcode.react
Backend
Node.js 20
Express
Mongoose
Zod
Luxon
Swagger / OpenAPI
Base de datos e infraestructura
MongoDB
Replica set de un nodo
Docker
Docker Compose
Git y GitHub
Arquitectura
Plain Text
┌──────────────────────┐
│ Cliente │
│ Catálogo y carrito │
└──────────┬───────────┘
│ Red local
▼
┌──────────────────────┐
│ React + Vite │
│ Interfaz web │
└──────────┬───────────┘
│ /api
▼
┌──────────────────────┐
│ Express │
│ API REST │
│ Validación y PIN │
└──────────┬───────────┘
│ Mongoose
▼
┌──────────────────────┐
│ MongoDB Replica Set │
│ Productos │
│ Pedidos │
│ Ventas │
└──────────────────────┘
Modelo de datos
Producto

Información principal:

_id
codigo
nombre
categoria
descripcion
precio
stock
imagen
activo
fechaBaja
createdAt
updatedAt

La eliminación de productos es lógica. Un producto inactivo se conserva para mantener el historial de ventas.

Pedido

Información principal:

_id
productos
estado
expiraEn
ventaId
completadoEn
createdAt
updatedAt

Estados posibles:

Plain Text
Pendiente
Completado
Cancelado
Expirado
Venta

Información principal:

_id
folio
productos
total
metodoPago
efectivoRecibido
cambio
estado
fechaCancelacion
motivoCancelacion
createdAt
updatedAt

Estados posibles:

Plain Text
Completada
Cancelada
Requisitos previos

Para ejecutar el proyecto se necesita:

Debian, Ubuntu o una distribución Linux similar.
Docker.
Docker Compose.
Node.js 20 o posterior compatible.
npm.
Git.
Navegador moderno.

Versiones utilizadas durante el desarrollo:

Plain Text
Node.js: 20.19.2
React: 19.3.1
React Router: 7.18.5
Lucide React: 1.73.0
qrcode.react: 4.2.0
Instalación
1. Clonar el repositorio
Shell
git clone \
https://github.com/CharlyDuque/nipponia-inventario-pos.git
 
cd nipponia-inventario-pos
2. Instalar dependencias del backend
Shell
npm install
3. Instalar dependencias del frontend
Shell
cd frontend
npm install
cd ..
Variables de entorno del backend

Crea un archivo .env en la raíz:

Shell
cp .env.example .env

Ejemplo:

Shell
env isn’t fully supported. Syntax highlighting is based on Shell.
PORT=3000
 
MONGO_URI=mongodb://USUARIO:CONTRASENA@localhost:27017/inventario?authSource=admin&replicaSet=rs0
 
OPERADOR_PIN=CONFIGURAR_PIN_LOCAL
 
PEDIDO_EXPIRACION_MINUTOS=180
Importante

No publiques:

Contraseñas.
PIN reales.
MONGO_URI con credenciales.
Archivos .env.
Keyfiles de MongoDB.
Variables de entorno del frontend

Crea:

Plain Text
frontend/.env

Ejemplo:

Plain Text
env isn’t fully supported. Syntax highlighting is based on Plain Text.
VITE_PUBLIC_APP_URL=http://IP_LOCAL:5173

La IP debe coincidir con la dirección Network mostrada por Vite.

También existe:

Plain Text
frontend/.env.example

con un valor de referencia que sí puede versionarse.

Iniciar el sistema
1. Iniciar MongoDB
Shell
docker start mongodb

Comprueba:

Shell
docker ps
2. Iniciar el backend

Desde la raíz:

Shell
npm run dev

Dirección esperada:

Plain Text
http://localhost:3000
3. Iniciar el frontend

En otra terminal:

Shell
cd frontend
npm run dev

Vite mostrará direcciones similares a:

Plain Text
Local: http://localhost:5173/
Network: http://192.168.100.19:5173/

La dirección Network permite el acceso desde otros dispositivos conectados a la misma red.

Rutas de la aplicación
Cliente
Plain Text
/cliente/catalogo
/cliente/carrito
Operador
Plain Text
/operador/acceso
/operador/inventario
/operador/caja
/operador/ventas
/operador/corte
Documentación API
Plain Text
http://localhost:3000/api-docs
Uso rápido
Cliente
Abrir /cliente/catalogo.
Buscar productos.
Agregar productos al carrito.
Modificar las cantidades.
Abrir el carrito.
Pulsar Preparar pedido.
Mostrar el QR generado al Operador.
Operador
Abrir /operador/acceso.
Ingresar el PIN.
Abrir Caja.
Pegar el contenido leído desde el QR.
Pulsar Cargar pedido.
Revisar productos y total.
Elegir Efectivo o Transferencia.
Confirmar el cobro.
Revisar el ticket.
Pulsar Finalizar.
Transacciones

MongoDB se configura como replica set para permitir transacciones.

Al registrar una venta se ejecutan conjuntamente:

Plain Text
Validar Pedido
Validar productos y cantidades
Descontar stock
Crear Venta
Marcar Pedido como Completado

Si una parte falla, la operación no debe quedar confirmada parcialmente.

Al cancelar una venta:

Plain Text
Restaurar stock
Cambiar Venta a Cancelada
Guardar fecha y motivo
Respaldo de MongoDB

Define un alias para mantener el mismo nombre durante todo el proceso:

Shell
BACKUP_NAME="inventario_mvp_$(date +%Y%m%d_%H%M%S).archive.gz"

Crear el respaldo dentro del contenedor:

Shell
docker exec -it mongodb mongodump \
--username admin \
--authenticationDatabase admin \
--db inventario \
--archive="/tmp/$BACKUP_NAME" \
--gzip \
--password

Copiarlo:

Shell
docker cp \
"mongodb:/tmp/$BACKUP_NAME" \
"backups/$BACKUP_NAME"

Validar la compresión:

Shell
gzip -t "backups/$BACKUP_NAME"

Probar su lectura sin restaurar:

Shell
docker exec -it mongodb mongorestore \
--username admin \
--authenticationDatabase admin \
--archive="/tmp/$BACKUP_NAME" \
--gzip \
--dryRun \
--password
Compilación de producción
Shell
cd frontend
npm run build

Durante la validación del MVP, el build procesó:

Plain Text
2,152 módulos
JavaScript: 346.93 kB
JavaScript gzip: 107.10 kB
CSS: 48.59 kB
CSS gzip: 7.91 kB
Pruebas realizadas

El MVP fue validado en:

Teléfono.
Tableta.
Computadora.
Dos dispositivos conectados simultáneamente.
Anchos de 390, 820 y 1366 píxeles.

Casos aprobados:

Pedido completo desde Cliente hasta Caja.
Efectivo y cálculo de cambio.
Transferencia.
Stock insuficiente.
Efectivo insuficiente.
Pedido expirado.
Doble cobro.
Cancelación de venta.
Doble cancelación.
Restauración de stock.
Corte por fecha.
Exclusión de ventas canceladas.
Protección por PIN.
Vaciado remoto del carrito.
Seguridad del MVP

El sistema utiliza un PIN administrativo para proteger:

Inventario.
Caja.
Ventas.
Corte.
Endpoints administrativos.

El PIN se envía mediante:

Plain Text
x-operador-pin

La interfaz conserva temporalmente el PIN en sessionStorage.

Esta protección está pensada para una red local controlada. Un despliegue público requeriría:

HTTPS.
Usuarios individuales.
Contraseñas cifradas.
Roles.
Sesiones firmadas.
Control de intentos.
Auditoría de accesos.

Estructura general

inventario-api/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── validators/
├── docker/
├── .env.example
├── docker-compose.yml
├── package.json
└── server.js

Documentación

La entrega académica incluye:

Reporte técnico.
Manual de usuario.
Retrospectiva.
Presentación.
Bitácora unificada.
Sistema de diseño.
Documentación API mediante Swagger.
Repositorio con etiqueta v1.0.0-mvp.

Autor

Carlos Humberto Díaz Duque

Proyecto en desarrollado
