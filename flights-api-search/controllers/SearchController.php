<?php
/**
 * Created by PhpStorm.
 * User: andrey
 * Date: 22.07.17
 * Time: 18:39
 */

namespace app\controllers;

use app\models\FlightsSearch;
use Yii;
use \yii\rest\Controller;
use GuzzleHttp\Client;
use app\models\Site;

class SearchController extends Controller
{
    public function actionCreate()
    {
        $name = Yii::$app->request->post();
        $model = new FlightsSearch();
        $model->attributes = $name;
        if ($model->validate()) {
            return [
                'status' => 'ok',
                'data' => $model->search(),
            ];
        }

        return [
            'status' => 'error',
            'data' => $model->getErrors(),
        ];
    }

    public function actionView($id)
    {
        // return FlightsSearch::instance()->getResults($id);
        $json = FlightsSearch::instance()->getResults($id);
        // return $json;

        foreach($json as $key=>$gate){
            // echo $gate['search_id'];
            // foreach($gate['proposals'] as $proposal){
            //     foreach($proposal['terms'] as $term) {
            //         // echo $gate['search_id']."===>>>". intval($term['url'])."\n";
            //         // $url = $this->getRedirect($gate['search_id'], intval($term['url']));
            //     }
            // }
            if(!isset($gate['gates_info']))
                continue;
            $site = "";
            $label = "";
            foreach($gate['gates_info'] as $info_key=>$info){
                $label = isset($info['label']) ? strval($info['label']) : "";
                // $site = isset($info['site']) ? strval($info['site']) : "";
            }
            // $site = str_replace(array("https://", "http://"), "", $site);
            if($label=="") continue;
            $rows = (new \yii\db\Query())
                ->select(['id', 'label', 'url'])
                ->from('site')
                ->where(['label' => $label])
                ->all();
            if(sizeof($rows)==0) {
                $res = Yii::$app->db->createCommand()->insert('site', [
                    'label' => $label,
                    'url' => $site
                    ])->execute();
            }
            $rows = (new \yii\db\Query())
                ->select("*")
                ->from('site')
                ->where(['label' => $label])
                ->all();
            $json[$key]['gates_info'][$info_key]['reviews'] = $rows[0];
                // echo json_encode($label . "===>>>" . $site)."\n";
        }
        
        return $json;
    }

    public function actionRedirect($searchId, $urlId)
    {
        return FlightsSearch::instance()->getRedirect($searchId, $urlId);
    }


}