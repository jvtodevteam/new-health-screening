<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('screening_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('name');
            $table->integer('age');
            $table->string('nationality');
            $table->string('id_number');
            $table->boolean('has_medical_history')->default(false);
            $table->text('allergies')->nullable();
            $table->text('past_medical_history')->nullable();
            $table->text('current_medications')->nullable();
            $table->text('family_medical_history')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('participants');
    }
}