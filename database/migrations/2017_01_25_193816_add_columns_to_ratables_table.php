<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToRatablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ratables', function (Blueprint $table) {
            $table->decimal('Rating', 5, 2)->nullable();
            $table->integer('NumberOfRatings')->nullable();
        });
        
        Schema::rename('ratables', 'Ratables');
        Schema::rename('users', 'Users');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ratables', function (Blueprint $table) {
            //
        });
    }
}
