<?php
    namespace app\models;
    use Yii;
    use yii\base\Model;

    class ScrapData extends Model
    {
        public $name;
        public $email;

        public function getData()
        {
            return [
                [['name', 'email'], 'required'],
                ['email', 'email'],
            ];
        }

    }