<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $customers = Customer::latest('created_at')->get()->toArray();

        return response($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        // TODO refactor to avoid duplication in validation
        $validator = Validator::make($request->all(),[
            'email' => 'required|string|unique:customers',
            'name' => 'required|string',
            'avatar' =>  'required|image'
        ]);

        if ($validator->fails()){
            return response([
                'status' => false,
                'message' => 'validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $avatar = $request->avatar;
            $fileName = date('YmdH') . $avatar->getClientOriginalName();

            //Get the path to the folder where the image is stored and then save the path in database
            $path = $request->avatar->storeAs('images', $fileName, 'public');
        }

        Customer::create([
            'name' => $request->name,
            'email' => $request->email,
            'avatar' => $path ?? null,
        ]);

        return response(['status' => 'Customer created.'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer): Response
    {
        return response($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): Response
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response(['message' => 'Customer not found'], 404);
        }

        $validator = Validator::make($request->all(),[
            'email' => 'required|string|unique:customers',
            'name' => 'required|string',
            'avatar' =>  'image'
        ]);

        if($validator->fails()){
            return response([
                'status' => false,
                'message' => 'validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        if ($request->hasFile('avatar')) {
            $avatar = $request->avatar;
            $fileName = date('YmdH') . $avatar->getClientOriginalName();

            //Get the path to the folder where the image is stored and then save the path in database
            $path = $request->avatar->storeAs('images', $fileName, 'public');
            $customer['avatar'] = $path;
        }
        $customer->update($request->except('avatar'));

        return response(['status' => 'Customer updated.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): Response
    {
        $customer->delete();

        return response(['status' => 'Customer deleted.']);
    }
}
