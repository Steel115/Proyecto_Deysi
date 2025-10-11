<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'description',
        'price',
        'id_usuario', // ESTO permite que el controlador guarde el valor.
        'stock',
    ];

    /**
     * Relación con el usuario creador.
     * Laravel busca por defecto 'user_id', así que debemos especificar la clave.
     */
    public function creator()
    {
        // El producto pertenece a un usuario a través de la clave 'id_usuario'
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function user()
{
    // Esto vincula Product con User a través de la columna 'id_usuario'
    return $this->belongsTo(User::class, 'id_usuario'); 
}
}
