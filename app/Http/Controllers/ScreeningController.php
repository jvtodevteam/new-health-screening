<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;

class ScreeningController extends Controller
{
    function index(){
        return inertia('Screening/Index');
    }
    function generatePayment(Request $request){
        Configuration::setXenditKey(env('XENDIT_KEY'));
        $paymentMethod = [];

        if($request->payment_method == 'cc'){
            $paymentMethod = ["CREDIT_CARD"];
        }
        else if($request->payment_method == 'qris'){
            $paymentMethod = ["QRIS"];
        }
        else if($request->payment_method == 'ovo'){
            $paymentMethod = ["OVO"];
        }
        else if($request->payment_method == 'bni'){
            $paymentMethod = ["BNI"];
        }
        else if($request->payment_method == 'bri'){
            $paymentMethod = ["BRI"];
        }
        else if($request->payment_method == 'mandiri'){
            $paymentMethod = ["MANDIRI"];
        }
        
        
        $apiInstance = new InvoiceApi();
        $create_invoice_request = new CreateInvoiceRequest([
          'external_id' => $request->external_id,
          'description' => $request->description,
          'invoice_duration' => 86400,
          'amount' => $request->amount,
          'currency' => 'IDR',
          'customer' => [
            "given_names" => $request->customer,
          ],
          "items" => [
            [
                'name' => "Screening Payment",
                'quantity' => $request->quantity,
                'price' => $request->price,
            ]
        ],
          "fees" => [
            [
              "type" => "TAX",
              "value" => 0,
            ]
          ],
          "payment_methods" => $paymentMethod,
          "success_redirect_url" => url('success-payment'),   
        ]);

        $result = $apiInstance->createInvoice($create_invoice_request);
        return $result;
    }
}
