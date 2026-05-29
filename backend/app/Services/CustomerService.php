<?php

namespace App\Services;

use App\Models\Customer;
use App\Repositories\CustomerRepository;

class CustomerService
{
    public function __construct(private CustomerRepository $repo) {}

    public function list(array $filters)
    {
        return $this->repo->paginate($filters);
    }

    public function all()
    {
        return $this->repo->all();
    }

    public function find(int $id): Customer
    {
        return $this->repo->find($id);
    }

    public function create(array $data): Customer
    {
        return $this->repo->create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        return $this->repo->update($customer, $data);
    }

    public function delete(Customer $customer): void
    {
        $this->repo->delete($customer);
    }
}
