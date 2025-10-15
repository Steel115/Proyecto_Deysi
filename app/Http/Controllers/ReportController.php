<?php

namespace App\Http\Controllers;
use App\Models\ActivityLog; 
use PDF; // Importar la clase PDF

class ReportController extends Controller
{
    public function activityReport()
    {
        // 1. INICIAR CAPTURA DE SALIDA
        // Esto previene que cualquier error o espacio en blanco salga antes del PDF
        ob_start(); 
        
        $activities = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->get();
        
        $pdf = PDF::loadView('reports.report', [
            'activities' => $activities,
            'reportTitle' => 'Reporte Global de Actividad del Sistema',
            'generationDate' => now()->format('d/m/Y H:i:s'),
        ]);

        // 2. LIMPIAR BUFFER DE SALIDA
        ob_get_clean(); 

        // 3. DESCARGA DEL PDF (debe ser lo primero que se envíe)
        return $pdf->download('reporte_actividad_' . now()->format('Ymd_His') . '.pdf');
    }
}