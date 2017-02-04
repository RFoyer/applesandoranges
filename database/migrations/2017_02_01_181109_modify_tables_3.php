<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifyTables3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ratables', function(Blueprint $table) {
            $table->string('desc', 500)->default('No description yet.');
            $table->string('img_src')->default('#');
            $table->string('img_use_rationale_src')->default('#');
            $table->string('class')->default('');            
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
