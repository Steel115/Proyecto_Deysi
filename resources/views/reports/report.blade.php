<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $reportTitle }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #555;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #1a202c;
            font-size: 24px;
            margin: 0;
        }
        .meta {
            text-align: right;
            font-size: 10px;
            margin-bottom: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            /* Evita que los datos muy largos rompan la tabla */
            word-wrap: break-word; 
        }
        .table th {
            background-color: #f2f2f2;
            color: #333;
            font-weight: bold;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #777;
            padding: 10px 0;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>{{ $reportTitle }}</h1>
        <p>Inventario y Ventas SteelHZ</p>
    </div>

    <div class="meta">
        Fecha de Generación: {{ $generationDate }}
    </div>

    @if ($activities->isEmpty())
        <p style="text-align: center; color: red;">No se encontraron registros de actividad para este reporte.</p>
    @else
        <table class="table">
            <thead>
                <tr>
                    <th>ID Log</th>
                    <th>Fecha y Hora</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Recurso ID</th>
                    <th>Detalles</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($activities as $activity)
                    <tr>
                        <td>{{ $activity->id }}</td>
                        <td>{{ $activity->created_at->format('Y-m-d H:i:s') }}</td>
                        {{-- Usamos $activity->user->name para obtener el nombre del usuario --}}
                        <td>{{ $activity->user->name ?? 'Usuario Desconocido' }} (ID: {{ $activity->user_id }})</td>
                        <td>{{ $activity->action }}</td>
                        <td>{{ $activity->related_id ?? 'N/A' }} ({{ $activity->related_type ?? 'N/A' }})</td>
                        <td>{{ $activity->details ?? '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
        Reporte generado automáticamente. Propiedad de {{ config('app.name', 'Laravel') }}.
    </div>

</body>
</html>