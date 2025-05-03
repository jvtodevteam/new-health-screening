<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('participants', function (Blueprint $table) {
            // Add the new column
            $table->foreignId('nationality_id')->nullable()->after('age');
            
            // Create foreign key reference
            $table->foreign('nationality_id')
                  ->references('id')
                  ->on('nationalities')
                  ->onDelete('set null');
                  
            // Keep the old nationality column for now, can remove in a future migration
            // after data migration is complete
            $table->dropColumn('nationality');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('participants', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['nationality_id']);
            
            // Drop the column
            $table->dropColumn('nationality_id');
            
            // Change nationality column back to required
            $table->string('nationality');
        });
    }
};
