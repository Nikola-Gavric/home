<?php
declare(strict_types = 1);
namespace app\controllers;

use app\models\ScrapData;
use Yii;
use \yii\rest\Controller;
use GuzzleHttp\Client;

class ScrapController extends Controller
{ 
    public function actionIndex()
    {
        header("Content-Type: text/plain;charset=utf-8");

        $rows = (new \yii\db\Query())
            ->select(['id', 'label', 'url'])
            ->from('site')
            // ->where(['label' => $label])
            ->all();

        //     if(sizeof($rows)==0)
        //         Yii::$app->db->createCommand()->insert('site', [
        //             'label' => $label,
        //             'url' => $site
        //         ])->execute();


        // $url = isset($_GET['site']) ? $_GET['site'] : 'Mytrip.com';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_ENCODING, '');
        $reviews = [];
        $count = 0;
        foreach($rows as $row){
            $url = $row['url'];
            if($url=='') continue;
            curl_setopt($ch, CURLOPT_URL, "https://uk.trustpilot.com/review/$url?languages=en");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            $trustpilot = curl_exec($ch);
            if (curl_errno($ch)) {
                continue;
                //die('fatal error: curl_exec failed, ' . curl_errno($ch) . ": " . curl_error($ch));
            }
            // $domd = @DOMDocument::loadHTML($trustpilot);
            // $src = $domd->textContent;
            $src = $trustpilot;
            $revpos = strpos($src, "numberOfReviews");
            if(!$revpos) continue;
            $rev_start = strrpos(substr($src,0,$revpos), "{");
            $rev_end = strpos($src, "}", $revpos);
            $rev = substr($src, $rev_start+1, $rev_end-$rev_start-1);
            
            $revpos = strpos($src, "mainEntity");
            if(!$revpos) continue;
            $rev_start = strpos($src, "[", $revpos);
            $rev_end = strpos($src, ";", $revpos);
            $rating = substr($src, $rev_start+1, $rev_end-$rev_start-6);
            
            $reviews = [];
            $revs = explode(',', $rev);
            foreach($revs as $rev){
                $rev = explode(':', $rev);
                $reviews[str_replace('"', "", $rev[0])] = str_replace('"', "", $rev[1]);
            }
            
            $reviews_data = [];
            $rating = substr($rating, 1, strlen($rating)-2);
            $ratings = explode('},{', $rating);
            foreach($ratings as $rating){
                $rating = str_replace(array("[", "]", "{", "}"), "", $rating);
                $rating = explode(',"csvw:cells":', $rating);
                $key = intval(str_replace('"csvw:name":"',"",$rating[0]));
                $rating = str_replace(array('"csvw:value":"','","csvw:notes"'),"", $rating[1]);
                $rating = str_replace('"', "", $rating);
                $value = explode(":", $rating);
                $reviews_data[$key]["score"] = intval($value[0]);
                $reviews_data[$key]["rating"] = intval($value[1]);
            }
            
            Yii::$app->db->createCommand()->update('site', [
                'score' => $reviews["trustScore"],
                'rating' => $reviews_data[0]["rating"],
                'reviews' => $reviews_data[0]["score"],
                'excellent_reviews' => $reviews_data[5]["score"],
                'excellent_rating' => $reviews_data[5]["rating"],
                'great_reviews' => $reviews_data[4]["score"],
                'great_rating' => $reviews_data[4]["rating"],
                'average_reviews' => $reviews_data[3]["score"],
                'average_rating' => $reviews_data[3]["rating"],
                'poor_reviews' => $reviews_data[2]["score"],
                'poor_rating' => $reviews_data[2]["rating"],
                'bad_reviews' => $reviews_data[1]["score"],
                'bad_rating' => $reviews_data[1]["rating"],
                'scan_date' => date("Y-m-d h:i:s"),
            ], "url like '$url'")->execute();
            // var_dump($reviews); var_dump($reviews_data);
            $count++;
        }
        curl_close($ch);
        
        echo "Updated successfully : $count agencies";
        exit;

        return $this->render('index', ['reviews'=>$reviews, 'reviews_data'=>$reviews_data]);
    }

    public function actionGetdata()
    {
        $model = new ScrapData();
        if($model->load(Yii::$app->request->post()) && $model->validate()){
            return $this->render('entry-confirm', ['model' => $model]);
        } else {
            return $this->render('entry', ['model' => $model]);
        }


    }

}

