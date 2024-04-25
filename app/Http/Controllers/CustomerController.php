<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
        $validator = $this->validateInput($request, 'store');

        //stop validating all attributes once a single validation failure has occurred
        if ($validator->stopOnFirstFailure()->fails()) {
            return response([
                'message' => 'validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $validated = $this->handleAvatar($request, $validator);
        Customer::create($validated);

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

        $validator = $this->validateInput($request, 'update', $id);

        //stop validating all attributes once a single validation failure has occurred
        if ($validator->stopOnFirstFailure()->fails()) {
            return response([
                'message' => 'validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $validated = $this->handleAvatar($request, $validator);
        $customer->update($validated);

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

    private function validateInput(Request $request, string $action, ?int $id = null): \Illuminate\Validation\Validator
    {
        // create a validator instance manually using the Validator facade.
        if ($action === 'store') {
            $avatarRules = 'required|image|max:1024'; //The avatar field must not be greater than 1024 kilobytes
            $uniqueRule = 'unique:customers';
        } else {
            $avatarRules = 'image|max:1024';
            $uniqueRule = Rule::unique('customers')->ignore($id);
        }

        $validator = Validator::make($request->all(),[
            'email' => ['required','email', $uniqueRule],
            'name' => 'required|string',
            'avatar' =>  $avatarRules
        ], [
            'email.required' => 'Email address is required',
        ]);

        $validator->after(function ($validator) use ($request) {
            if ($request->hasFile('avatar') && !$request->file('avatar')->isValid()) {
                $validator->errors()->add(
                    'avatar', 'Avatar image is invalid!'
                );
            }
        });

        return $validator;
    }

    private function handleAvatar(Request $request, \Illuminate\Validation\Validator $validator): array
    {
        if ($request->hasFile('avatar')) {
            $avatar = $request->avatar;
            $fileName = date('YmdH') . $avatar->getClientOriginalName();
            //Get the path to the folder where the image is stored and then save the path in database
            $path = $request->avatar->storeAs('images', $fileName, 'public');
            $validated = $validator->safe()->merge(['avatar' => $path ?? null])->toArray();
        } else {
            $validated = $validator->safe()->toArray();
        }

        return $validated;
    }
}
