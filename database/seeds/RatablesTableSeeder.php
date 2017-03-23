<?php

use Illuminate\Database\Seeder;

class RatablesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ratables')->insert([
            'name' => 'Star Wars: The Force Awakens',
            'desc' => 'Epic space opera film (2015), the seventh episode in the Star Wars saga.',
            'class' => 'films',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/a/a2/Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Breaking Bad',
            'desc' => 'Crime drama tv series (2008-2013), often considered the best tv series of all time.',
            'class' => 'tv-shows',
            'creator_id' => 1,
            'approved' => true,
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/6/61/Breaking_Bad_title_card.png',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Breaking_Bad_title_card.png'
        ]);
        DB::table('ratables')->insert([
            'name' => 'Batman v Superman: Dawn of Justice',
            'desc' => 'Superhero film (2016), often considered one of the worst films of 2016.',
            'class' => 'films',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/2/20/Batman_v_Superman_poster.jpg',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Batman_v_Superman_poster.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'House of Cards (U.S. TV series)',
            'desc' => 'Political drama web tv series (2013-) originally debuting on Netflix.',
            'class' => 'tv-series',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/3/3f/House_of_Cards_title_card.png',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:House_of_Cards_title_card.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Vikings (TV series)',
            'desc' => 'Historical drama tv series (2013-) inspired by the sagas of Viking Ragnar Lothbrok.',
            'class' => 'tv-series',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/9/99/Vikings_Title.png',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Vikings_Title.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'The Americans (2013 TV series)',
            'desc' => 'Period drama tv series (2013-) set in the early 1980s during the Cold War.',
            'class' => 'tv-series',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/4/46/The-americans-title-card.png',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:The-americans-title-card.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Downton Abbey',
            'desc' => 'Historical period drama tv series (2010-2015) set in the fictional Yorkshire country estate of Downton Abbey between 1912 and 1925.',
            'class' => 'tv-series',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/c/c4/Downton_Abbey_Title_Card.jpg',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Downton_Abbey_Title_Card.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Pride and Prejudice',
            'desc' => 'Novel (1813) by English novelist Jane Austen.',
            'class' => 'books',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:PrideAndPrejudiceTitlePage.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'New American Bible Revised Edition',
            'desc' => 'Catholic Bible translation (2011).',
            'class' => 'books',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/d/d9/BIG_NABRE.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:BIG_NABRE.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Moby-Dick',
            'desc' => 'Novel (1851) by American writer Herman Melville, originally published in a censored British version under the title <i>The Whale</i>. Melville immediately changed the title to <i>Moby-Dick</i>, which refers to the name of the main antagonist, a fictional white whale (spelled with no hyphen in the book).',
            'class' => 'books',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/3/36/Moby-Dick_FE_title_page.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Moby-Dick_FE_title_page.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Cafe Centraal',
            'desc' => 'Restaurant located in the Bay View neighborhood of Milwaukee, Wisconsin.',
            'class' => 'restaurant region:{USA;Milwaukee,WI;}',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'The Palm Tavern',
            'desc' => 'Bar located in the Bay View neighborhood of Milwaukee, Wisconsin.',
            'class' => 'restaurant region:{USA;Milwaukee,WI;}',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Facebook',
            'desc' => 'Online social media and social networking service.',
            'class' => 'companies',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Facebook_New_Logo_%282015%29.svg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Facebook_New_Logo_(2015).svg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Sharpies (marker)',
            'class' => 'objects',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/4/4f/Sharpie_Logo.svg',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Sharpie_Logo.svg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Coffee',
            'desc' => 'Brewed beverage prepared from roasted coffee beans.',
            'class' => 'drinks',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:A_small_cup_of_coffee.JPG',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Tea',
            'desc' => 'Aromatic beverage prepared by pouring heated water over cured leaves of the evergreen shrub <i>Camellia sinensis</i>.',
            'class' => 'drinks',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Tea_leaves_steeping_in_a_zhong_%C4%8Daj_05.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Tea_leaves_steeping_in_a_zhong_%C4%8Daj_05.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => "McDonald's",
            'desc' => 'Fast food restaurant.',
            'class' => 'restaurants',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:McDonald%27s_Golden_Arches.svg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Ice cream',
            'desc' => 'Frozen dessert.',
            'class' => 'food',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/3/31/Ice_Cream_dessert_02.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Ice_Cream_dessert_02.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => '"Stairway to Heaven"',
            'desc' => 'Song (1971) by the English rock band Led Zeppelin, usually considered one of the best rock songs of all time.',
            'class' => 'songs',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Stairway_to_Heaven_by_Led_Zeppelin_US_promotional_single.png',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Stairway_to_Heaven_by_Led_Zeppelin_US_promotional_single.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Clothing',
            'desc' => 'Fiber and textile material worn on the body.',
            'class' => 'clothing',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/9/96/Clothes.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Clothes.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Beards',
            'desc' => 'Collections of hair that grows on the chin and cheeks of humans and some non-human animals.',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Charles_Darwin_by_Julia_Margaret_Cameron_2.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Charles_Darwin_by_Julia_Margaret_Cameron_2.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Death',
            'desc' => 'Cessation of biological functions that sustain an organism.',
            'class' => 'events',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/9/92/Skullclose.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Skullclose.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Taxes',
            'desc' => 'Compulsory contributions to government revenue.',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/d/d6/8denarii.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:8denarii.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Stoicism',
            'desc' => 'School of Hellenistic philosophy.',
            'class' => 'philosophy',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Marcus_Aurelius_Metropolitan_Museum.png',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Marcus_Aurelius_Metropolitan_Museum.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Spiders',
            'desc' => 'Air-breathing arthropods with eight legs.',
            'class' => 'animals',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Theraphosa_blondi_MHNT.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Theraphosa_blondi_MHNT.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => '<i>Mona Lisa</i>',
            'desc' => 'Painting by Leonardo da Vinci.',
            'class' => 'art paintings',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => '2016 (year)',
            'desc' => 'Leap year in the Gregorian calendar, the 2016th year of the Common Era (CE) and <i>Anno Domini</i> (AD) designations.',
            'class' => 'periods',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => '2017 (year)',
            'desc' => 'Year in the Gregorian calendar, the 2017th year of the Common Era (CE) and <i>Anno Domini</i> (AD) designations.',
            'class' => 'periods',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Life (human experience)',
            'desc' => "The totality of common human experiences.",
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/3/39/Almeida_J%C3%BAnior_-_Mo%C3%A7a_com_Livro.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Almeida_J%C3%BAnior_-_Mo%C3%A7a_com_Livro.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Iphone',
            'desc' => 'Smartphone line designed and marketed by Apple Inc.',
            'class' => 'products tech',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/3/3b/IPhone_5s_top.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:IPhone_5s_top.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'IPhone 7',
            'desc' => 'Smartphones designed and marketed by Apple Inc. and released in 2016.',
            'class' => 'products tech',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/6/64/IPhone_7_Plus_Jet_Black.svg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:IPhone_7_Plus_Jet_Black.svg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Eggnog',
            'desc' => 'Creamy dairy-based beverage.',
            'class' => 'drinks',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Eggnog2.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Eggnog2.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Beer',
            'desc' => 'Alcoholic beverage brewed in a process involving the fermentation of starches.',
            'class' => 'drinks',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/7/78/GravityTap.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:GravityTap.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Wine',
            'desc' => 'Alcoholic beverage made from fermented grapes.',
            'class' => 'drinks',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Red_and_white_wine_12-2015.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Red_and_white_wine_12-2015.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'High heels',
            'class' => "Footwear that raises the heel of the wearer's foot significantly higher than the toes.",
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/8/82/Stilettos-heels-b.JPG',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Stilettos-heels-b.JPG',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'YouTube',
            'desc' => 'Video-sharing website owned by Google.',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/e/ef/YouTube_logo_2015.svg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:YouTube_logo_2015.svg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Avatar (2009 film)',
            'desc' => 'Epic science fiction film, highest-grossing film of all time.',
            'class' => 'films',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Avatar-Teaser-Poster.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Raspberry Pi',
            'desc' => 'Series of credit card-sized single-board computers developed by the Raspberry Pi Foundation to promote teaching of basic computer science.',
            'class' => 'tech',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Raspberry_Pi_3_Model_B.png',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Raspberry_Pi_3_Model_B.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'NES Classic Edition',
            'desc' => 'Miniature replica of the Nintendo Entertainment System (NES) and first released in 2016.',
            'class' => 'games',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/b/bb/NES_Mini_Menu.png',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:NES_Mini_Menu.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'LASIK',
            'desc' => 'Refractive eye surgery for the correction of myopia, hyperopia, and astigmatism.',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Ageev_iris.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Ageev_iris.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Country music',
            'desc' => 'Genre of southern United States popular music.',
            'class' => 'music',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Fishing (recreational)',
            'desc' => 'Activity of trying to catch fish.',
            'class' => 'activities',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/1/11/P%C3%A1tzcuaro-Trad-Fishing-3.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:P%C3%A1tzcuaro-Trad-Fishing-3.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Running',
            'desc' => 'Method of terestial locomotion.',
            'class' => 'activities',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Long_Distance_Runners%2C_Ancient_Greece%2C_Amphora.png',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Long_Distance_Runners,_Ancient_Greece,_Amphora.png',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Golf',
            'desc' => 'Sport in which players use clubs to hit balls into a series of holes on a course in as few strokes as possible.',
            'class' => 'sports',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golfer_swing.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Golfer_swing.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Roller coasters',
            'desc' => 'Amusement rides developed for amusement parks.',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/commons/6/65/Luna_Park_Melbourne_scenic_railway.jpg',
            'img_use_rationale_src' => 'https://commons.wikimedia.org/wiki/File:Luna_Park_Melbourne_scenic_railway.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => '<i>Captain Underpants</i>',
            'desc' => "Children's novel series by American author and illustrator Dav Pilkey.",
            'class' => 'books',
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/9/96/Captainunderpantscover.jpg',
            'img_use_rationale_src' => 'https://en.wikipedia.org/wiki/File:Captainunderpantscover.jpg',
            'creator_id' => 1,
            'approved' => true
        ]);
        DB::table('ratables')->insert([
            'name' => 'Apples and Oranges',
            'desc' => 'Universal ratings and reviews website created by Raymond Foyer. Not to be confused with the 1967 Pink Floyd song.',
            'creator_id' => 1,
            'approved' => true
        ]);        
    }
}
