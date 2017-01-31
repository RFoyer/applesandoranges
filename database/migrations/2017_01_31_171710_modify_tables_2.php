<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifyTables2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ratables', function(Blueprint $table) {
            $table->dropColumn(['Rating', 'NumberOfRatings']);
            $table->unsignedInteger('creator_id')->default('2');
            $table->boolean('approved')->default(false);
            $table->boolean('rejected')->default(false);
            
            $table->foreign('creator_id')->references('id')->on('users');
            $table->unique('name');                        
        });
        
        Schema::table('ratings', function(Blueprint $table) {
            $table->dropColumn('Ratable');
            $table->unsignedInteger('ratable_id')->default('1');
            
            $table->renameColumn('"UserID"', 'user_id');    
            
            $table->foreign('ratable_id')->references('id')->on('ratables');
            $table->primary(['user_id', 'ratable_id']);
        });
        
        Schema::table('reviews', function(Blueprint $table) {
            $table->dropColumn('Ratable');
            $table->unsignedInteger('ratable_id')->default('1');
            
            $table->renameColumn('"UserID"', 'user_id');
            
            $table->foreign('ratable_id')->references('id')->on('ratables');
            $table->primary(['user_id', 'ratable_id']);
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
