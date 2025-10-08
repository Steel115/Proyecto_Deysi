<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Esto asegura que solo los usuarios autenticados puedan usar este formulario
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // El campo 'description' (descripción) es obligatorio y debe ser una cadena
            'description' => ['required', 'string', 'max:255'],
            
            // El campo 'price' (precio) es obligatorio, debe ser un número y mayor que 0
            'price' => ['required', 'numeric', 'min:0'],
            
            // Si tu formulario tiene más campos, agrégalos aquí.
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'description.required' => 'La descripción del producto es obligatoria.',
            'description.string' => 'La descripción debe ser texto.',
            'price.required' => 'El precio del producto es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio debe ser mayor o igual a 0.',
        ];
    }
}
