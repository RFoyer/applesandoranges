<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //actually dropped primary keys.
        Schema::table('ratings', function(Blueprint $table) {
            $table->dropPrimary('ratings_user_id_ratable_id_primary');            
        });
        Schema::table('reviews', function(Blueprint $table) {
            $table->dropPrimary('ratings_user_id_ratable_id_primary');            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
