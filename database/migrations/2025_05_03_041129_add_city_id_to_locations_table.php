<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->unsignedBigInteger('city_id')->nullable()->after('name');
            $table->foreign('city_id')
                  ->references('id')->on('cities')
                  ->onUpdate('cascade')
                  ->onDelete('set null');
            $table->dropColumn('city');
        });
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropForeign(['city_id']);
            $table->dropColumn('city_id');
            $table->string('city')->nullable();
        });
    }
};
