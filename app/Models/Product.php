<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'image_path',
        'category_id'
    ];
    
    protected $appends = ['image_url'];
    /**
     * Relación con el usuario creador.
     * Laravel busca por defecto 'user_id', así que debemos especificar la clave.
     */
     public function category()
    {
        return $this->belongsTo(Category::class);
    }
      public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            // Storage::url() genera la URL pública correcta.
            return Storage::url($this->image_path);
        }
        // Devuelve una imagen por defecto si no hay ninguna.
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQTGUFUPs1xpgBwZsWNX18TOFpJFC67j7uGw&s'; // O la ruta a una imagen por defecto
    }
    
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
